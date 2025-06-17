fn main(amounts: [Field; 4], min_total_salary: Field) {
    let mut total_salary = 0;

    for i in 0..4 {
        assert(amounts[i] != 0, "Amount must not be zero");
        total_salary += amounts[i];
    }

    let total_salary_int: i32 = total_salary as i32;
    let min_total_salary_int: i32 = min_total_salary as i32;
    assert(total_salary_int >= min_total_salary_int);
}